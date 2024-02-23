{php $tags = dr_get_content_tags($value);}
<br>
{loop $tags $name $url}
{$url}
{$name}
{/loop}