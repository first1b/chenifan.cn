<?php

/**
 * 菜单配置
 */


return [

    'admin' => [

        'content' => [

            'left' => [


                // 分组菜单
                'app-chtml' => [
                    'name' => '静态生成',
                    'icon' => 'fa fa-file-text',
                    'link' => [
                        [
                            'name' => '生成栏目',
                            'icon' => 'fa fa-file-o',
                            'uri' => 'chtml/cat/index',
                        ],
                        [
                            'name' => '生成内容',
                            'icon' => 'fa fa-file-text',
                            'uri' => 'chtml/html/index',
                        ],
                        [
                            'name' => '定时任务',
                            'icon' => 'fa fa-clock-o',
                            'uri' => 'chtml/time/index',
                        ],

                    ]
                ],



            ],



        ],




    ],



];