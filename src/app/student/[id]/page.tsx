'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useToast } from "@/components/ui/use-toast"

interface Student {
  id: number
  name: string
  age: number
  address: string
}

export default function StudentDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await fetch(`/api/students/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch student')
        }
        const data = await response.json()
        setStudent(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch student data",
          variant: "destructive",
        })
        router.push('/')
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [params.id, router, toast])

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this student?')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/students/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete student')
      }

      toast({
        title: "Success",
        description: "Student deleted successfully",
      })

      router.push('/')
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          Loading...
        </CardContent>
      </Card>
    )
  }

  if (!student) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          Student not found
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Student Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Name</h2>
            <p>{student.name}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Age</h2>
            <p>{student.age}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Address</h2>
            <p>{student.address}</p>
          </div>
          <div className="flex space-x-4 pt-4">
            <Button asChild variant="outline">
              <Link href="/">Back to List</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/student/${student.id}/edit`}>Edit Student</Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Student'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}