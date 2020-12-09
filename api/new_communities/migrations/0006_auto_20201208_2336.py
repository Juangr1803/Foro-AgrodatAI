# Generated by Django 3.1.3 on 2020-12-08 23:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('new_communities', '0005_joinuser_text'),
    ]

    operations = [
        migrations.CreateModel(
            name='Email',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
            ],
        ),
        migrations.AlterModelOptions(
            name='newcommunity',
            options={'ordering': ('-created',)},
        ),
    ]
