import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { normalizePhone } from '@/lib/phone'
import { checkContactLimit } from '../middleware/plan-limits'

export const contactsRouter = router({
  // Get all contacts with filtering
  getAll: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      listId: z.string().optional(),
      tagId: z.string().optional(),
      isOptedOut: z.boolean().optional(),
      skip: z.number().default(0),
      take: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = { userId: ctx.user.id }
      
      if (input.search) {
        where.OR = [
          { firstName: { contains: input.search, mode: 'insensitive' } },
          { lastName: { contains: input.search, mode: 'insensitive' } },
          { phoneNumber: { contains: input.search } },
          { email: { contains: input.search, mode: 'insensitive' } },
        ]
      }
      
      if (input.listId) {
        where.lists = { some: { listId: input.listId } }
      }
      
      if (input.tagId) {
        where.tags = { some: { tagId: input.tagId } }
      }
      
      if (input.isOptedOut !== undefined) {
        where.isOptedOut = input.isOptedOut
      }

      const [contacts, total] = await Promise.all([
        ctx.prisma.contact.findMany({
          where,
          include: {
            lists: { include: { list: true } },
            tags: { include: { tag: true } },
          },
          skip: input.skip,
          take: input.take,
          orderBy: { createdAt: 'desc' },
        }),
        ctx.prisma.contact.count({ where }),
      ])

      return { contacts, total }
    }),

  // Get single contact with full details
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.contact.findFirst({
        where: { id: input, userId: ctx.user.id },
        include: {
          lists: { include: { list: true } },
          tags: { include: { tag: true } },
          customValues: { include: { customField: true } },
        },
      })
    }),

  // Create contact
  create: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      listIds: z.array(z.string()).optional(),
      tagIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await checkContactLimit(ctx.user.id)

      const normalizedPhone = normalizePhone(input.phoneNumber)
      
      // Check for existing contact
      const existing = await ctx.prisma.contact.findUnique({
        where: { userId_phoneNumber: { userId: ctx.user.id, phoneNumber: normalizedPhone } },
      })
      
      if (existing) {
        throw new Error('Contact with this phone number already exists')
      }

      const { listIds, tagIds, ...contactData } = input

      return ctx.prisma.contact.create({
        data: {
          ...contactData,
          phoneNumber: normalizedPhone,
          userId: ctx.user.id,
          lists: listIds ? {
            create: listIds.map(listId => ({ listId })),
          } : undefined,
          tags: tagIds ? {
            create: tagIds.map(tagId => ({ tagId })),
          } : undefined,
        },
      })
    }),

  // Bulk import contacts from CSV
  bulkImport: protectedProcedure
    .input(z.object({
      contacts: z.array(z.object({
        phoneNumber: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
      })),
      listId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const normalized = input.contacts.map(c => ({
        ...c,
        phoneNumber: normalizePhone(c.phoneNumber),
        userId: ctx.user.id,
      }))

      // Remove duplicates by phone number
      const uniqueContacts = Array.from(
        new Map(normalized.map(c => [c.phoneNumber, c])).values()
      )

      // Create contacts (skip duplicates)
      const created = await ctx.prisma.contact.createMany({
        data: uniqueContacts,
        skipDuplicates: true,
      })

      // If listId provided, add all to list
      if (input.listId && created.count > 0) {
        const contacts = await ctx.prisma.contact.findMany({
          where: {
            userId: ctx.user.id,
            phoneNumber: { in: uniqueContacts.map(c => c.phoneNumber) },
          },
          select: { id: true },
        })

        await ctx.prisma.contactListMember.createMany({
          data: contacts.map(c => ({ contactId: c.id, listId: input.listId! })),
          skipDuplicates: true,
        })
      }

      return { imported: created.count, skipped: uniqueContacts.length - created.count }
    }),

  // Find duplicates
  findDuplicates: protectedProcedure.query(async ({ ctx }) => {
    const contacts = await ctx.prisma.contact.findMany({
      where: { userId: ctx.user.id },
      select: { phoneNumber: true, id: true, firstName: true, lastName: true, createdAt: true },
      orderBy: { phoneNumber: 'asc' },
    })

    const groups: any[] = []
    let current: any[] = []
    let lastPhone = ''

    for (const contact of contacts) {
      if (contact.phoneNumber === lastPhone) {
        if (current.length === 0) {
          current.push(contacts[contacts.indexOf(contact) - 1])
        }
        current.push(contact)
      } else {
        if (current.length > 1) {
          groups.push(current)
        }
        current = []
      }
      lastPhone = contact.phoneNumber
    }

    if (current.length > 1) {
      groups.push(current)
    }

    return groups
  }),

  // Merge duplicates
  mergeDuplicates: protectedProcedure
    .input(z.object({
      keepId: z.string(),
      mergeIds: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get all contacts to merge
      const contacts = await ctx.prisma.contact.findMany({
        where: {
          id: { in: [input.keepId, ...input.mergeIds] },
          userId: ctx.user.id,
        },
        include: {
          lists: true,
          tags: true,
          customValues: true,
        },
      })

      const keep = contacts.find(c => c.id === input.keepId)
      const merge = contacts.filter(c => input.mergeIds.includes(c.id))

      if (!keep || merge.length === 0) {
        throw new Error('Invalid contact IDs')
      }

      // Collect all unique lists and tags
      const allListIds = new Set(keep.lists.map(l => l.listId))
      const allTagIds = new Set(keep.tags.map(t => t.tagId))

      merge.forEach(contact => {
        contact.lists.forEach(l => allListIds.add(l.listId))
        contact.tags.forEach(t => allTagIds.add(t.tagId))
      })

      // Update keep contact with merged lists and tags
      await ctx.prisma.contactListMember.createMany({
        data: Array.from(allListIds).map(listId => ({
          contactId: keep.id,
          listId,
        })),
        skipDuplicates: true,
      })

      await ctx.prisma.contactTag.createMany({
        data: Array.from(allTagIds).map(tagId => ({
          contactId: keep.id,
          tagId,
        })),
        skipDuplicates: true,
      })

      // Delete merged contacts
      await ctx.prisma.contact.deleteMany({
        where: { id: { in: input.mergeIds }, userId: ctx.user.id },
      })

      return { merged: input.mergeIds.length }
    }),

  // Update contact
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.contact.update({
        where: { id, userId: ctx.user.id },
        data,
      })
    }),

  // Delete contacts
  delete: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contact.deleteMany({
        where: { id: { in: input.ids }, userId: ctx.user.id },
      })
    }),

  // Bulk add to list
  addToList: protectedProcedure
    .input(z.object({
      contactIds: z.array(z.string()),
      listId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.contactListMember.createMany({
        data: input.contactIds.map(contactId => ({
          contactId,
          listId: input.listId,
        })),
        skipDuplicates: true,
      })
      return { added: input.contactIds.length }
    }),

  // Bulk apply tag
  applyTag: protectedProcedure
    .input(z.object({
      contactIds: z.array(z.string()),
      tagId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.contactTag.createMany({
        data: input.contactIds.map(contactId => ({
          contactId,
          tagId: input.tagId,
        })),
        skipDuplicates: true,
      })
      return { tagged: input.contactIds.length }
    }),
})
