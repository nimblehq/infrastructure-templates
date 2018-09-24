resource "aws_iam_user" "prod_user" {
    name = "service_${var.hadex_s3_bucket}"
}

resource "aws_s3_bucket" "hadex_bucket_prod" {
    bucket = "${var.hadex_s3_bucket}"
    acl = "public-read"

    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["PUT","POST"]
        allowed_origins = ["*"]
        expose_headers = ["ETag"]
        max_age_seconds = 3000
    }

    policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "PublicReadForGetBucketObjects",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_PROD_BUCKET/*"
        },
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "AWS": "${aws_iam_user.prod_user.arn}"
            },
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::${var.hadex_s3_bucket}",
                "arn:aws:s3:::${var.hadex_s3_bucket}/*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_user" "staging_user" {
    name = "service_${var.hadex_s3_bucket}"
}

resource "aws_s3_bucket" "hadex_bucket_staging" {
    bucket = "${var.hadex_s3_bucket_staging}"
    acl = "public-read"

    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["PUT","POST"]
        allowed_origins = ["*"]
        expose_headers = ["ETag"]
        max_age_seconds = 3000
    }

    policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "PublicReadForGetTestBucketObjects",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${var.hadex_s3_bucket}/*"
        },
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "AWS": "${aws_iam_user.staging_user.arn}"
            },
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::${var.hadex_s3_bucket_staging}",
                "arn:aws:s3:::${var.hadex_s3_bucket_staging}/*"
            ]
        }
    ]
}
EOF
}