import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the data
    if (!body.name || !body.age || !body.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the student
    const student = await prisma.student.create({
      data: {
        name: body.name,
        age: parseInt(body.age),
        address: body.address,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Failed to create student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}