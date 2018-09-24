output "aws_public_dns" {
  description = "This ${var.name} instance public IP"
  value = "${aws_instance.hadex.public_dns}"
}