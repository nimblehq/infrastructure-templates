data "aws_iam_policy_document" "sns_platform_assume_role_policy" {
  statement {
    sid     = "SnsPlatformAssumeRolePolicy"
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "sns_platform_log_policy" {
  statement {
    sid    = "LogMobilePushNotificationsPolicy"
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:PutMetricFilter",
      "logs:PutRetentionPolicy"
    ]

    resources = ["*"]
  }
}

resource "aws_iam_role" "sns_platform_role" {
  name = "${var.namespace}-sns-platform-log-role"

  assume_role_policy = data.aws_iam_policy_document.sns_platform_assume_role_policy.json
}

resource "aws_iam_policy" "sns_platform_log_policy" {
  name   = "${var.namespace}-platform-log-policy"
  policy = data.aws_iam_policy_document.sns_platform_log_policy.json
}

resource "aws_iam_role_policy_attachment" "sns_platform_log_policy" {
  role       = aws_iam_role.sns_platform_role.name
  policy_arn = aws_iam_policy.sns_platform_log_policy.arn
}

resource "aws_sns_platform_application" "mobile_push_notifications" {
  name                      = "${var.namespace}-mobile-push-notifications"
  platform                  = "GCM"
  failure_feedback_role_arn = aws_iam_role.sns_platform_role.arn
  success_feedback_role_arn = aws_iam_role.sns_platform_role.arn
  platform_credential       = var.firebase_cloud_messaging_api_key
}
