'use client'

import * as React from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface AdminConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmLabel?: string
  confirmVariant?: 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  isLoading?: boolean
  children?: React.ReactNode
}

export default function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  isLoading = false,
  children,
}: AdminConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="space-y-4">
        {children && <div className="py-2">{children}</div>}
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {isLoading ? (
              <Spinner className="h-4 w-4 mr-2" />
            ) : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
