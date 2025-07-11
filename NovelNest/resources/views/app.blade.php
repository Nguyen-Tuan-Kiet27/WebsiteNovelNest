<!DOCTYPE html>
<html>


<head>
    
    <link href="https://fonts.googleapis.com/css2?family=Prata&display=swap" rel="stylesheet">
    <link rel="icon" href="{{asset('img/logo_v4.png') }}" type="image/png">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>