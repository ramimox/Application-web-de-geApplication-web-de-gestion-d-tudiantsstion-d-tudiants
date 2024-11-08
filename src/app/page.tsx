import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const prisma = new PrismaClient()

async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        id: 'desc'
      }
    })
    return students
  } catch (error) {
    console.error('Failed to fetch students:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

export default async function Home() {
  const students = await getStudents()

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student List</h1>
        <Button asChild>
          <Link href="/add-student">Add New Student</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-semibold">{student.name}</h2>
                <p className="text-sm text-muted-foreground">ID: {student.id}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href={`/student/${student.id}`}>View Details</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/student/${student.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {students.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No students found. Add a new student to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}