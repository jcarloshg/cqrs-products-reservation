# Strcuture DB

## Product

- uuid: string
- name: string
- description: string
- price: number

## Stock

- uuid: string
- productUuid: string
- reservedQuantity: number

## Reservations

- uuid: string
- ownerUuid: string
- productId: string
- quantity: number
- status: "PENDING" |"CONFIRMED" |"CANCELLED" |"EXPIRED"
- expiresAt: datetime
