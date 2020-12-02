# Generated by Django 3.1.3 on 2020-12-02 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('interests', '0001_initial'),
        ('new_communities', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='communities',
            field=models.ManyToManyField(to='new_communities.NewCommunity'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='interests',
            field=models.ManyToManyField(to='interests.Interest'),
        ),
    ]
