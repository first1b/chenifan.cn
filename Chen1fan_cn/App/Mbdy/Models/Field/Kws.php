{php $kws = dr_get_content_kws($value, 'MOD_DIR');}
<br>
{loop $kws $name $url}
{$url}
{$name}
{/loop}