<?php
/**
 * ==========================================================================
 * API SERVIDOR HOSTINGER — SUZE BOLSAS | MATERNIDADE
 * Salva Catálogo, Fotos Excluídas, Produtos e Backup de Pedidos no Servidor
 * ==========================================================================
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/dados_servidor';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$catalogFile   = $dataDir . '/catalogo-oficial.json';
$discardedFile = $dataDir . '/fotos-excluidas.json';
$productsFile  = $dataDir . '/produtos-loja.json';
$ordersFile    = $dataDir . '/pedidos-recebidos.json';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ==================== LEITURA (GET) ====================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'get_catalog') {
        if (file_exists($catalogFile)) {
            echo file_get_contents($catalogFile);
        } else {
            echo json_encode(['status' => 'empty']);
        }
        exit;
    }

    if ($action === 'get_discarded') {
        if (file_exists($discardedFile)) {
            echo file_get_contents($discardedFile);
        } else {
            echo json_encode([]);
        }
        exit;
    }

    if ($action === 'get_products') {
        if (file_exists($productsFile)) {
            echo file_get_contents($productsFile);
        } else {
            echo json_encode(['status' => 'empty']);
        }
        exit;
    }

    if ($action === 'get_orders') {
        if (file_exists($ordersFile)) {
            echo file_get_contents($ordersFile);
        } else {
            echo json_encode([]);
        }
        exit;
    }

    echo json_encode([
        'status' => 'ok',
        'server' => 'Hostinger PHP API — Suze Bolsas',
        'timestamp' => date('c')
    ]);
    exit;
}

// ==================== GRAVAÇÃO (POST) ====================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawBody = file_get_contents('php://input');
    $payload = json_decode($rawBody, true);

    if ($payload === null) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'JSON inválido']);
        exit;
    }

    // 1. Salvar Catálogo Oficial
    if ($action === 'save_catalog' && isset($payload['items']) && is_array($payload['items'])) {
        file_put_contents($catalogFile, json_encode($payload['items'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['ok' => true, 'count' => count($payload['items'])]);
        exit;
    }

    // 2. Salvar Fotos Excluídas do Separador
    if ($action === 'save_discarded' && isset($payload['discarded']) && is_array($payload['discarded'])) {
        file_put_contents($discardedFile, json_encode($payload['discarded'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['ok' => true, 'count' => count($payload['discarded'])]);
        exit;
    }

    // 3. Salvar Produtos do Admin
    if ($action === 'save_products' && isset($payload['products']) && is_array($payload['products'])) {
        file_put_contents($productsFile, json_encode($payload['products'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['ok' => true, 'count' => count($payload['products'])]);
        exit;
    }

    // 4. Salvar Pedido antes de redirecionar para o WhatsApp (Zero Pedidos Perdidos!)
    if ($action === 'save_order') {
        $existingOrders = [];
        if (file_exists($ordersFile)) {
            $decoded = json_decode(file_get_contents($ordersFile), true);
            if (is_array($decoded)) {
                $existingOrders = $decoded;
            }
        }

        $newOrder = [
            'id' => 'PED-' . date('Ymd-His') . '-' . rand(100, 999),
            'createdAt' => date('d/m/Y H:i:s'),
            'customer' => isset($payload['customer']) ? $payload['customer'] : [],
            'items' => isset($payload['items']) ? $payload['items'] : [],
            'shipping' => isset($payload['shipping']) ? $payload['shipping'] : [],
            'total' => isset($payload['total']) ? $payload['total'] : 0
        ];

        array_unshift($existingOrders, $newOrder);
        // Mantém os últimos 500 pedidos salvos
        $existingOrders = array_slice($existingOrders, 0, 500);

        file_put_contents($ordersFile, json_encode($existingOrders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['ok' => true, 'orderId' => $newOrder['id']]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Ação desconhecida']);
    exit;
}
