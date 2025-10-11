# Strcuture DB

## User

- uuid: string
- userName:string
- password: string

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
- userUuid: string
- productId: string
- quantity: number
- status: "PENDING" |"CONFIRMED" |"CANCELLED" |"EXPIRED"
- expiresAt: datetime
