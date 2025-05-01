import subprocess
import sys

test_project = "afhdynamicwebsite-test"
prod_project = "afhdynamicwebsite"

test_sites = {
    "helpinghandafh-com-test": "vfCMoPjAu2ROVBbKvk0D",
    "aefamilyhome-com-test": "UiSDf9elSjwcbQs2HZb1",
    "countrycrestafh-com-test": "yrNc50SvfPqwTSkvvygA",
    "prestigecareafh-com-test": "pDJgpl34XUnRblyIlBA7",
    "sbmediahub-com-test": "MGou3rzTVIbP77OLmZa7",
    "elderlyhomecareafh-com-test": "SJgFxBYkopnPR4WibCAf",
    "serenitypark-com-test": "SJgFxBYkopnPR4WibCAf",
}

prod_sites = {
    "helpinghandafh-com-prod": "vfCMoPjAu2ROVBbKvk0D",
    "aefamilyhome-com-prod": "UiSDf9elSjwcbQs2HZb1",
    "countrycrestafh-com-prod": "yrNc50SvfPqwTSkvvygA",
    "prestigecareafh-com-prod": "pDJgpl34XUnRblyIlBA7",
    "sbmediahub-com-prod": "MGou3rzTVIbP77OLmZa7",
    "elderlyhomecareafh-com-prod": "SJgFxBYkopnPR4WibCAf",
    "serenitypark-com-prod": "SJgFxBYkopnPR4WibCAf",
}

def prompt_choice(prompt, options):
    for i, opt in enumerate(options, 1):
        print(f"{i}) {opt}")
    while True:
        try:
            choice = int(input(f"{prompt} ")) - 1
            if 0 <= choice < len(options):
                return options[choice]
            print("Invalid selection.")
        except ValueError:
            print("Please enter a valid number.")

def deploy_sites(sites, project):
    site_keys = list(sites.keys())

    print("\nAvailable sites:")
    for i, site in enumerate(site_keys, 1):
        print(f"{i}) {site}")
    print(f"{len(site_keys)+1}) Deploy ALL")
    print(f"{len(site_keys)+2}) Quit")

    try:
        selection = int(input("#? ")) - 1
        if selection == len(site_keys):
            for site in site_keys:
                run_deploy(site, project)
        elif selection == len(site_keys) + 1:
            print("Exiting.")
        elif 0 <= selection < len(site_keys):
            run_deploy(site_keys[selection], project)
        else:
            print("Invalid selection.")
    except ValueError:
        print("Invalid input. Exiting.")

def run_deploy(site, project):
    print(f"\n🚀 Deploying site: {site} (project: {project})")
    cmd = ["firebase", "deploy", "--only", f"hosting:{site}", "--project", project]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Deployment failed for {site}: {e}")

if __name__ == "__main__":
    print("Select environment:")
    env = prompt_choice("#?", ["test", "prod"])

    if env == "test":
        deploy_sites(test_sites, test_project)
    else:
        deploy_sites(prod_sites, prod_project)
    print("Deployment complete.")
    sys.exit(0)
