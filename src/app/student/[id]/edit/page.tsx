'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface Student {
  id: number
  name: string
  age: number
  address: string
}

export default function EditStudent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStudent(prev => prev ? { ...prev, [name]: value } : null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!student) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/students/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      })

      if (!response.ok) {
        throw new Error('Failed to update student')
      }

      toast({
        title: "Success",
        description: "Student updated successfully",
      })

      router.push(`/student/${params.id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
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
        <CardTitle>Edit Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={student.age}
              onChange={handleChange}
              required
              min="1"
              max="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={student.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Update Student'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}