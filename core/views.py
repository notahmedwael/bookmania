from django.shortcuts import render

def index(request):
    return render(request, 'core/index.html')

def contact_us(request):
    return render(request, 'core/contact_us.html')

def faq(request):
    return render(request, 'core/faq.html')