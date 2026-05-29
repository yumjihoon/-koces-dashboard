export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint, body, token } = req.body;

    // 허용된 엔드포인트만 통과 (보안)
    const allowed = [
      '/mkcs/openApi/token.do',
      '/mkcs/openApi/card.do',
      '/mkcs/openApi/cash.do',
      '/mkcs/openApi/icCash.do',
      '/mkcs/openApi/payment.do',
      '/mkcs/openApi/authSum.do',
      '/mkcs/openApi/termInfo.do',
      '/mkcs/openApi/sale/month.do',
      '/mkcs/openApi/taxAuth.do',
      '/mkcs/openApi/taxAuth/send.do',
    ];

    if (!allowed.includes(endpoint)) {
      return res.status(403).json({ error: '허용되지 않은 엔드포인트' });
    }

    const SERVER = 'https://mkctest.koces.com'; // 테스트서버
    // const SERVER = 'https://mkcs.koces.com'; // 운영서버

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(SERVER + endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      resultMsg: '프록시 오류: ' + error.message,
      errorCode: 'PROXY_ERROR'
    });
  }
}
