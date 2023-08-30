variable "environment" {
  description = "The application environment, used to tag the resources, e.g. `acme-web-staging`"
  type        = string
}

variable "owner" {
  description = "The owner of the infrastructure, used to tag the resources, e.g. `acme-web`"
  type        = string
}

variable "namespace" {
  description = "The namespace for the application infrastructure on the selected provider, e.g. acme-web"
  type        = string
}
