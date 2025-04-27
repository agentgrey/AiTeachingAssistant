"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Share2, Edit } from "lucide-react"
import Link from "next/link"
import { FileUpload } from "@/components/file-upload"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getRequest, postRequest, patchRequest } from '@/lib/api'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = useParams();
  
  const [assignment, setAssignment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [assignNameOpen, setAssignNameOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [selectedStudent, setSelectedStudent] = useState("")
  const [manualStudentName, setManualStudentName] = useState("")
  const [activeTab, setActiveTab] = useState("select")
  const { toast } = useToast()

  // Mock data for the assignment
  // const assignment = {
  //   id: params.id,
  //   title: "Essay on Climate Change",
  //   description: "Write a 500-word essay on the impacts of climate change on global ecosystems.",
  //   dueDate: "2023-12-15",
  //   totalPoints: 100,
  //   submissions: [
  //     {
  //       id: "1",
  //       studentName: "John Doe",
  //       studentId: "S12345",
  //       submissionDate: "2023-12-10",
  //       status: "graded",
  //       score: 85,
  //       aiScore: 92,
  //       plagiarismScore: 98,
  //     },
  //     {
  //       id: "2",
  //       studentName: "Jane Smith",
  //       studentId: "S12346",
  //       submissionDate: "2023-12-12",
  //       status: "pending",
  //       score: null,
  //       aiScore: 88,
  //       plagiarismScore: 95,
  //     },
  //     {
  //       id: "3",
  //       studentName: "Bob Johnson",
  //       studentId: "S12347",
  //       submissionDate: "2023-12-14",
  //       status: "graded",
  //       score: 92,
  //       aiScore: 90,
  //       plagiarismScore: 100,
  //     },
  //     {
  //       id: "4",
  //       studentName: null,
  //       studentId: "S12348",
  //       submissionDate: "2023-12-14",
  //       status: "pending",
  //       score: null,
  //       aiScore: 0,
  //       plagiarismScore: 0,
  //     },
  //   ],
  // }

  const fetchAssignment = async () => {
    try {
      setLoading(true)
      const res = await getRequest<{ token: string; user: any }>(`/assignment/${id}`)
      setAssignment(res)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return;
    fetchAssignment();
  }, [id])

  const handleUploadComplete = async(files: File[], images: string[]) => {
    if(isSubmitting) return;
    setIsSubmitting(true)
    // console.log("Files uploaded:", files)
    // console.log("Images captured:", images)
    
    if (files.length == 0 && images.length == 0) {
      console.error("No files/images uploaded");
      return; 
    }

    const formData = new FormData();
    files.forEach((file) => {
      console.log("Appending file to FormData:", file);
      formData.append("files[]", file);
    });
    images.forEach((imageUrl) => {
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "image.jpg", { type: blob.type });
          formData.append("files[]", file);
        });
    });

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    await addSubmission(formData);
    setIsSubmitting(false)
  }

  const handleEditAssignment = () => {
    router.push(`/dashboard/assignments/${id}/edit`)
  }

  const handleAssignName = async() => {
    const studentName = activeTab === "select" ? selectedStudent : manualStudentName

    if (!studentName) {
      toast({
        title: "Error",
        description: "Please select or enter a student name",
        variant: "destructive",
      })
      return
    }

    try {
      await patchRequest(`/assignment/${id}/submissions/${selectedSubmission._id}`, {
        studentName,
      })

      toast({
        title: "Success",
        description: `Submission assigned to ${studentName}`,
      })

      fetchAssignment()
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Failed to assign student name",
        variant: "destructive",
      })
    }

    toast({
      title: "Success",
      description: `Submission assigned to ${studentName}`,
    })

    setAssignNameOpen(false)
    setSelectedSubmission(null)
    setSelectedStudent("")
    setManualStudentName("")
  }

  const addSubmission = async (submissionData: FormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/assignment/${id}/submit`, {
        method: 'POST',
        body: submissionData,  
      });
      // console.log(response);

      toast({
        title: "Success",
        description: "Submission added successfully",
      })
      fetchAssignment()
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Failed to add submission",
        variant: "destructive",
      })
    }
  }

  const openAssignNameDialog = (submission: any) => {
    setSelectedSubmission(submission)
    setAssignNameOpen(true)
  }

  if (loading) return <div className="p-10 text-center">Loading assignment...</div>
  if (error || !assignment) return <div className="p-10 text-center text-red-500">Failed to load assignment.</div>

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
          <p className="text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <FileUpload
            trigger={<Button>Submit Assignment</Button>}
            title="Submit Assignment"
            description="Upload your completed assignment. You can upload files or take photos."
            onUploadComplete={handleUploadComplete}
          />
          <Button variant="outline" onClick={handleEditAssignment}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Assignment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{assignment.description}</p>
          <p className="mt-2">
            <strong>Total Points:</strong> {assignment.totalPoints}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>{assignment.submissions.length} submissions received</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignment.submissions.map((submission: any) => (
              <div key={submission._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {submission.studentName
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {submission.studentName ? (
                      <p className="font-medium">{submission.studentName}</p>
                    ) : (
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-blue-500"
                        onClick={() => openAssignNameDialog(submission)}
                      >
                        Assign Student Name
                      </Button>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {submission.status === "graded" ? (
                    <Badge className="bg-green-500">{submission.score}/100</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild title="Share">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission._id}/share`}>
                        <Share2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Download">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission._id}/download`}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Review">
                      <Link href={`/dashboard/assignments/${id}/submissions/${submission._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={assignNameOpen} onOpenChange={setAssignNameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Student Name</DialogTitle>
            <DialogDescription>
              This submission doesn't have a student name. Please assign a student to it.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select Student</TabsTrigger>
              <TabsTrigger value="manual">Enter Manually</TabsTrigger>
            </TabsList>

            <TabsContent value="select" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-select">Select from class roster</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student-select">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* This would be populated from your actual student list */}
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="alex-johnson">Alex Johnson</SelectItem>
                    <SelectItem value="sam-wilson">Sam Wilson</SelectItem>
                    <SelectItem value="taylor-brown">Taylor Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Enter student name</Label>
                <Input
                  id="student-name"
                  value={manualStudentName}
                  onChange={(e) => setManualStudentName(e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={handleAssignName}>Assign Name</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
