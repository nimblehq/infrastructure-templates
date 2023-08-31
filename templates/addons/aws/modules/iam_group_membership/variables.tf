variable "name" {
  description = "The name to identify the Group Membership"
  type        = string
}

variable "group" {
  description = "The IAM Group name to attach the list of users to"
  type        = string
}

variable "users" {
  description = "A list of IAM User names to associate with the Group"
  type        = list(string)
}
