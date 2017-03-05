# Gallery

实现**[瀑布流布局](http://kadong.space/Gallery/views/waterfall.html)**和**[木桶布局](http://kadong.space/Gallery/views/bucket.html)**

向第三方图片源500px请求图片资源，会出现每次刷新图片不同的情况，同一张图片请求了两种像素大小的url，缩略图用来加载布局减少缓冲时间，高清图用来大图显示。

实现分为三个模块：

* Modal大图显示，实现图片懒加载

* Application应用层对各模块进行组织以及页面逻辑实现

* Waterfall瀑布流布局 | Bucket木桶布局

