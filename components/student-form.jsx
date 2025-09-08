"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, User, Mail, BookOpen, ImageIcon, Upload } from "lucide-react"

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
  const [imagePreview, setImagePreview] = useState("")
  const [uploadMode, setUploadMode] = useState("url") // "url" or "file"

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        courseId: student.courseId?.toString() || "",
        profileImage: student.profileImage || "",
      })
      if (student.profileImage) {
        setImagePreview(student.profileImage)
      }
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

    if (field === "profileImage" && uploadMode === "url") {
      setImagePreview(value)
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, profileImage: "Please select a valid image file" }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profileImage: "Image size must be less than 5MB" }))
      return
    }

    // Read file and convert to data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setFormData((prev) => ({ ...prev, profileImage: dataUrl }))
      setImagePreview(dataUrl)
      // Clear any previous errors
      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: "" }))
      }
    }
    reader.readAsDataURL(file)
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

          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Profile Image (Optional)
            </Label>

            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                type="button"
                variant={uploadMode === "url" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUploadMode("url")}
                className="flex-1 h-8"
              >
                <ImageIcon className="w-3 h-3 mr-1" />
                URL
              </Button>
              <Button
                type="button"
                variant={uploadMode === "file" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUploadMode("file")}
                className="flex-1 h-8"
              >
                <Upload className="w-3 h-3 mr-1" />
                Upload
              </Button>
            </div>

            {uploadMode === "url" ? (
              <Input
                id="profileImage"
                type="url"
                value={formData.profileImage}
                onChange={(e) => handleInputChange("profileImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-background border-border/50 focus:border-primary"
              />
            ) : (
              <div className="space-y-2">
                <Input
                  id="profileImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="bg-background border-border/50 focus:border-primary file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
              </div>
            )}

            {imagePreview && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Profile preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                  onError={() => setImagePreview("")}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Preview</p>
                  <p className="text-xs text-muted-foreground">{uploadMode === "url" ? "From URL" : "Uploaded file"}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImagePreview("")
                    setFormData((prev) => ({ ...prev, profileImage: "" }))
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {errors.profileImage && <p className="text-sm text-destructive font-medium">{errors.profileImage}</p>}
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
