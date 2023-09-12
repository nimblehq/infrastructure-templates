variable "environment" {
  description = "The application environment, used to tag the resources, e.g. `staging`, `prod`, ..."
  type        = string
}

variable "owner" {
  description = "The owner of the infrastructure, used to tag the resources, e.g. `acme-web`"
  type        = string
}
