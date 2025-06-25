import type { CollectionBeforeValidateHook, Where } from 'payload'

import { ValidationError } from 'payload'

import { getUserTenantIDs } from '../../../utilities/getUserTenantIDs'
import { extractID } from '@/utilities/extractID'

export const ensureUniqueSlug: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
  // @ts-ignore
  value,
}) => {
  // if value is unchanged, skip validation
  if (originalDoc.slug === value) {
    return value
  }

  const constraints: Where[] = [
    {
      slug: {
        equals: value,
      },
    },
  ]

  const incomingTenantID = extractID(data?.tenant)
  const currentTenantID = extractID(originalDoc?.tenant)
  const tenantIDToMatch = incomingTenantID || currentTenantID

  if (tenantIDToMatch) {
    constraints.push({
      tenant: {
        equals: tenantIDToMatch,
      },
    })
  }

  const findDuplicatePosts = await req.payload.find({
    collection: 'posts',
    where: {
      and: constraints,
    },
  })

  if (findDuplicatePosts.docs.length > 0 && req.user) {
    const tenantIDs = getUserTenantIDs(req.user)
    // if the user is an admin or has access to more than 1 tenant
    // provide a more specific error message
    if (req.user.roles?.includes('super-admin') || tenantIDs.length > 1) {
      const attemptedTenantChange = await req.payload.findByID({
        id: tenantIDToMatch,
        collection: 'tenants',
      })

      throw new ValidationError({
        errors: [
          {
            message: `The "${attemptedTenantChange.name}" tenant already has a post with the slug "${value}". Slugs must be unique per tenant.`,
            path: 'slug',
          },
        ],
      })
    }

    throw new ValidationError({
      errors: [
        {
          message: `A post with the slug ${value} already exists. Slug must be unique per tenant.`,
          path: 'slug',
        },
      ],
    })
  }

  return value
}
