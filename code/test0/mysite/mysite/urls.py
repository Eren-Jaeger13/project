"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.contrib import admin
from django.urls import path
from . import views  # 导入视图函数

urlpatterns = [
    path('admin/', admin.site.urls),  # 保留admin路由
    path('', views.index, name='index'),  # 主页路由（访问http://127.0.0.1:8000/时显示index.html）
    path('test/', views.test_module, name='test_module'),  # 测试模块路由（访问http://127.0.0.1:8000/test/时显示iii.html）
    path('study/', views.study_room, name='study_room'),  # 新增：自习室路由（访问http://127.0.0.1:8000/study/时显示study.html）
]