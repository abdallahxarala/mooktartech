'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { TenantConfig } from '@/lib/config/tenants'

interface TenantContextType {
  tenant: TenantConfig
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ 
  children, 
  tenant 
}: { 
  children: ReactNode
  tenant: TenantConfig 
}) {
  return (
    <TenantContext.Provider value={{ tenant }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}

