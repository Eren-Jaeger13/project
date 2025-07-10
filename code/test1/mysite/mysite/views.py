from django.shortcuts import render

# 主页视图：返回index.html
def index(request):
    return render(request, 'index.html')

# 测试模块视图：返回iii.html
def test_module(request):
    return render(request, 'iii.html')

# 新增：自习室视图
def study_room(request):
    return render(request, 'study_room.html')  # 确保文件名统一