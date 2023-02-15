#
# Example Terraform tfVars for PingOne related deployments
#
# 1. Move this file to location of your terraform plan/modules
# 2. Ensure name of this file is terraform.tfvars
# 3. Optionally replace commented variables below.
#    Values below with no value (i.e. {{...}})
#
# Now, you can run your terraform commands.  In general the following steps will apply
# this plan to your environment:
#
#    terraform init                   // Download terraform providers/modules
#    terraform apply                  // Apply plan
#
# To destroy the environment:
#
#    terraform destroy                // Destroy what has been previously built
#

# target_environment_name        = ""
# admin_password                 = ""
admin_client_id                = "{{pingone_clientId}}"
admin_client_secret            = "{{pingone_clientSecret}}"
admin_environment_id           = "{{pingone_envId}}"
license_name                   = "INTERNAL"
region                         = "NorthAmerica"
admin_username                 = "{{home_email}}"
target_environment_description = "SKO Environment - Built by Terraform CLI"
target_environment_type        = "SANDBOX"
target_population_name         = "SKO Population"
target_population_description  = "SKO Test Users"
