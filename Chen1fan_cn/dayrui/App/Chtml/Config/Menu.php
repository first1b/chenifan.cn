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
                            'name' => '一键生成',
                            'icon' => 'fa fa-cog',
                            'uri' => 'chtml/config/index',
                        ],
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
                            'name' => '定时内容任务',
                            'icon' => 'fa fa-clock-o',
                            'uri' => 'chtml/time/index',
                        ],
                        [
                            'name' => '定时栏目任务',
                            'icon' => 'fa fa-clock-o',
                            'uri' => 'chtml/ctime/index',
                        ],

                    ]
                ],



            ],



        ],




    ],



];