output "public_dns" {
  description = "Print out the instance IP after configuration for convenient accessibility"
  value = "${aws_instance.main.public_dns}"
}