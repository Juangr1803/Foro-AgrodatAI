# Generated by Django 3.1.3 on 2020-11-24 05:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Empresa',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_empresa', models.CharField(max_length=150, unique=True)),
                ('nit', models.CharField(max_length=100)),
                ('is_admin', models.IntegerField()),
                ('telefono', models.CharField(max_length=100)),
                ('tipo', models.CharField(max_length=1)),
            ],
        ),
    ]
