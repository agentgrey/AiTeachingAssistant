"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CalendarDays, Clock, FileText, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { getRequest } from "@/lib/api"

export default function AssignmentsPage() {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true)
      try {
        const res = await getRequest<any[]>("/assignment/");
        console.log('Fetched assignments:', res);
        setAssignments(res);
      } catch (err: any) {
        console.error('Error fetching assignments:', err);
        toast({
          title: "Error",
          description: "Failed to fetch assignments",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/create-assignment">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search assignments..." className="w-[200px] pl-8 md:w-[300px]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Card key={assignment._id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.course}</CardDescription>
                </div>
                <Badge>Active</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <FileText className="mr-1 h-4 w-4" />
                    <span>{assignment.type}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/assignments/${assignment._id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No assignments found.</p>
        )}
      </div>
    </div>
  )
}
