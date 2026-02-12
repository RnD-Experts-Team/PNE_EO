<!doctype html>
<html>
  <head>
    <title>API Docs</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0">
    <div id="app"></div>

    <!-- Load Scalar -->
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>

    <!-- Initialize -->
    <script>
      Scalar.createApiReference('#app', {
        url: '/openapi.json',
    })
    </script>
  </body>
</html>
