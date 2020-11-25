# Generated by Django 3.1.3 on 2020-11-24 05:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('interests', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=225)),
                ('activity', models.CharField(blank=True, max_length=100)),
                ('picture', models.ImageField(blank=True, null=True, upload_to='common/pictures')),
                ('description', models.CharField(blank=True, max_length=1000)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
