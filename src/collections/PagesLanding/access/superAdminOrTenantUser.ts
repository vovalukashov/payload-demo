import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'
import { isSuperAdmin } from '../../../access/isSuperAdmin'
import { Access } from 'payload'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { getCollectionIDType } from '@/utilities/getCollectionIDType'

export const superAdminOrTenantUserAccess: Access = async ({ req }) => {
  if (!req.user) {
    return false
  }

  const landingTenant = await req.payload.find({
    collection: 'tenants',
    where: {
      slug: {
        equals: '/',
      },
    },
  })

  if (!landingTenant.docs?.[0]?.id) {
    return false
  }

  const landingTenantId = landingTenant.docs[0].id

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )

  if (selectedTenant !== landingTenantId) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  const isTenantAdmin = getUserTenantIDs(req.user, 'tenant-admin')
  const isTenantEditor = getUserTenantIDs(req.user, 'tenant-editor')

  const hasAccess =
    isTenantAdmin.includes(landingTenantId) || isTenantEditor.includes(landingTenantId)

  if (!hasAccess) {
    return false
  }

  return true
}
