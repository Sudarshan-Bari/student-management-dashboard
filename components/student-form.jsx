"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, User, Mail, BookOpen, ImageIcon } from "lucide-react"

/**
 * StudentForm Component Props:
 * @typedef {Object} StudentFormProps
 * @property {Course[]} courses - Available courses array
 * @property {Student|null} [student] - Student to edit (null for add mode)
 * @property {Function} onSubmit - Callback when form is submitted
 * @property {Function} onCancel - Callback when form is cancelled
 */

/**
 * StudentForm Component
 *
 * A controlled form component for adding/editing students.
 * Demonstrates:
 * 1. Controlled components with useState
 * 2. Form validation patterns
 * 3. Email validation with regex
 * 4. Conditional rendering for edit vs add mode
 * 5. Event handling and form submission
 * 6. useEffect for populating edit form
 */
function StudentForm({ courses, student, onSubmit, onCancel }) {
  // Form state - all controlled inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    courseId: "",
    profileImage: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        courseId: student.courseId?.toString() || "",
        profileImage: student.profileImage || "",
      })
    }
  }, [student])

  // Email validation regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  /**
   * Form validation function
   * Demonstrates comprehensive form validation patterns
   */
  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Course validation
    if (!formData.courseId) {
      newErrors.courseId = "Please select a course"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle input changes
   * Demonstrates controlled component patterns
   */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  /**
   * Handle form submission
   * Demonstrates async form handling and validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form processing delay
      // This setTimeout demonstrates the event loop in action
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Generate profile image URL if not provided
      const profileImage =
        formData.profileImage ||
        `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(formData.name + " professional photo")}`

      onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        courseId: Number.parseInt(formData.courseId),
        profileImage,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-card to-card/50 border-0 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="font-heading text-xl">{student ? "Edit Student" : "Add New Student"}</CardTitle>
            <CardDescription>{student ? "Update student information" : "Enter student details below"}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0 hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter student's full name"
              className={`bg-background border-border/50 focus:border-primary ${
                errors.name ? "border-destructive focus:border-destructive" : ""
              }`}
            />
            {errors.name && <p className="text-sm text-destructive font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              className={`bg-background border-border/50 focus:border-primary ${
                errors.email ? "border-destructive focus:border-destructive" : ""
              }`}
            />
            {errors.email && <p className="text-sm text-destructive font-medium">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId" className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Course
            </Label>
            <select
              id="courseId"
              value={formData.courseId}
              onChange={(e) => handleInputChange("courseId", e.target.value)}
              className={`w-full px-3 py-2 bg-background border border-border/50 rounded-md text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.courseId ? "border-destructive focus:border-destructive" : ""
              }`}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.name}
                </option>
              ))}
            </select>
            {errors.courseId && <p className="text-sm text-destructive font-medium">{errors.courseId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImage" className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Profile Image URL (Optional)
            </Label>
            <Input
              id="profileImage"
              type="url"
              value={formData.profileImage}
              onChange={(e) => handleInputChange("profileImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-background border-border/50 focus:border-primary"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : student ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default StudentForm
