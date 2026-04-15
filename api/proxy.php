<?php
// Proxy PHP para evitar CORS ao consultar a API de CPF
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if (isset($_GET['cpf'])) {
    $cpf = $_GET['cpf'];
    
    // Fazer a requisição para a API original
    $url = "https://guiacnhsocial.click/api/consulta.php?cpf=" . $cpf;
    
    // Inicializar cURL
    $ch = curl_init();
    
    // Configurar cURL
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    // Headers necessários
    $headers = [
        'accept: */*',
        'accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'priority: u=1, i',
        'referer: https://guiacnhsocial.click/login',
        'sec-ch-ua: "Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
        'sec-ch-ua-mobile: ?0',
        'sec-ch-ua-platform: "Windows"',
        'sec-fetch-dest: empty',
        'sec-fetch-mode: cors',
        'sec-fetch-site: same-origin',
        'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
    ];
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    // Executar a requisição
    $response = curl_exec($ch);
    
    // Verificar erros
    if (curl_errno($ch)) {
        echo json_encode(['error' => curl_error($ch)]);
    } else {
        echo $response;
    }
    
    // Fechar cURL
    curl_close($ch);
} else {
    echo json_encode(['error' => 'CPF não fornecido']);
}
?>
