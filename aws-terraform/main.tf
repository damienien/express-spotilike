provider "aws" {
  region = "eu-west-2"  # Remplacez par votre région préférée
}

resource "aws_instance" "example" {
  ami           = "ami-07d20571c32ba6cdc" # AMI ID pour Ubuntu 22.04 dans la région eu-west-2
  instance_type = "t2.micro"

  tags = {
    Name = "Express-spotilike"
  }

  # Génération de la clé avec ssh-keygen -t rsa -b 2048 -C "xxx@xxx.fr"
  # Import de la clé RSA avec aws ec2 import-key-pair --key-name "ec2-key" --public-key-material fileb://~/.ssh/id_rsa.pub --region eu-west-2
  key_name = "ec2-key"  # Utilisation de la clé importée

  vpc_security_group_ids = [aws_security_group.instance.id]

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("~/.ssh/id_rsa")  # Chemin absolu vers votre clé privée SSH sur Windows
      host        = self.public_ip
    }
  }
}

resource "aws_security_group" "instance" {
  name        = "terraform-example-instance"
  description = "Allow SSH and HTTP traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "instance_ip" {
  value = aws_instance.example.public_ip
}
