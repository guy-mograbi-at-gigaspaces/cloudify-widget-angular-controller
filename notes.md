to create a new tag in git do the following

git tag <the_tag>

remove the tag

git tag -d <the_tag>
git push origin :refs/tags/<the_tag>

to update a tag use

git tag -f <the_tag>

to push the tag to a remote repository do

git push origin --tags