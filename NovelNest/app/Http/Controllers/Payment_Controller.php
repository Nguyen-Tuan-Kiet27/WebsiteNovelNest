<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\LichSuNap;
use Illuminate\Support\Facades\Log;
use App\Models\NguoiDung;

class Payment_Controller extends Controller
{
    //VNPAY
    public function vnpayPayment(Request $request){
        $user = $request->attributes->get('user');
        $vnp_TxnRef = time(); 

        $vnp_TmnCode    = 'KA0W8FKD';
        $vnp_HashSecret = 'L7T0QVNBJTZ13ZEG2FLVIIJHJEXV1ARG';
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:8000/vnpay_return?uid=".$user->id;


        $vnp_OrderInfo = 'Nạp '.$request->xu.'Xu vào ví NovelNest cho người dùng có id: '.$user->id;
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $request->amount;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $request->ip();
        $vnp_BankCode = 'NCB';

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount* 100,
            "vnp_Command" => $vnp_OrderType,
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => "other",
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);//  
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        $redirectUrl = $vnp_Url;
        return response()->json(['redirect_url' => $redirectUrl]);
    }
    public function vnpayReturn(Request $request)
    {
        
        $inputData = $request->all();
        $user = NguoiDung::find($inputData['uid']);
        unset($inputData['uid']);
        $vnp_HashSecret = 'L7T0QVNBJTZ13ZEG2FLVIIJHJEXV1ARG';

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

        ksort($inputData);
        $query = http_build_query($inputData);
        $secureHash = hash_hmac('sha512', $query, $vnp_HashSecret);

        if ($secureHash === $vnp_SecureHash) {
            if ($inputData['vnp_ResponseCode'] == '00') {
                $amount = $inputData['vnp_Amount'] / 100;
                $price = ['10000'=>10,'20000'=>20, '50000'=>50, '98000'=>100, '192000'=>200, '480000'=>50];
                $user = NguoiDung::find($user->id);
                $user->soDu += $price[$amount];
                $user->save();

                $hn = new LichSuNap();
                $hn->soLuongXu = $price[$amount];
                $hn->menhGia = $amount;
                $hn->thoiGian = now();
                $hn->id_NguoiDung = $user->id;
                $hn->save();

                return redirect('/muaxu')->with(['pay' => 1,'user'=> $user]);
            } else {
                return redirect('/muaxu')->with(['pay' => 2,'user'=> $user]);
            }
        } else {
            return redirect('/muaxu')->with(['pay' => 3,'user'=> $user]);
        }
    }
    //MOMO
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data))
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }
    public function momoPayment(Request $request){
        $user = $request->attributes->get('user');
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

        $orderInfo = "Thanh toán qua MoMo";
        $amount = $request->amount;
        $orderId = time() ."";
        $redirectUrl = "http://localhost:8000/momo_return";
        $ipnUrl = "http://localhost:8000/momo_return";
        $extraData = $user->id;

        $requestId = time() . "";
        $requestType = "payWithATM";

        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $data = array('partnerCode' => $partnerCode,
                    'partnerName' => "Test",
                    "storeId" => "MomoTestStore",
                    'requestId' => $requestId,
                    'amount' => $amount,
                    'orderId' => $orderId,
                    'orderInfo' => $orderInfo,
                    'redirectUrl' => $redirectUrl,
                    'ipnUrl' => $ipnUrl,
                    'lang' => 'vi',
                    'extraData' => $extraData,
                    'requestType' => $requestType,
                    'signature' => $signature);
        $result = $this->execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true);  // decode json
        return response()->json(['redirect_url' => $jsonResult['payUrl']]);
    }
    public function momoReturn(Request $request){
        // Dữ liệu trả về từ MoMo
        $inputData = $request->all();

        // Lấy thông tin người dùng từ extraData đã gửi kèm khi tạo thanh toán
        $user = NguoiDung::find($inputData['extraData'] ?? null);
        if (!$user) {
            return redirect('/muaxu')->with(['pay' => 3]);
        }

        // Kiểm tra chữ ký xác minh
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

        $rawHash = "accessKey={$accessKey}&amount={$inputData['amount']}&extraData={$inputData['extraData']}&message={$inputData['message']}&orderId={$inputData['orderId']}&orderInfo={$inputData['orderInfo']}&orderType={$inputData['orderType']}&partnerCode={$inputData['partnerCode']}&payType={$inputData['payType']}&requestId={$inputData['requestId']}&responseTime={$inputData['responseTime']}&resultCode={$inputData['resultCode']}&transId={$inputData['transId']}";
        
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        if ($signature === ($inputData['signature'] ?? '')) {
            if ($inputData['resultCode'] == '0') {
                $amount = $inputData['amount'];
                $price = ['10000'=>10,'20000'=>20, '50000'=>50, '98000'=>100, '192000'=>200, '480000'=>50];
                
                $user->soDu += $price[$amount] ?? 0;
                $user->save();

                $hn = new LichSuNap();
                $hn->soLuongXu = $price[$amount] ?? 0;
                $hn->menhGia = $amount;
                $hn->thoiGian = now();
                $hn->id_NguoiDung = $user->id;
                $hn->save();

                return redirect('/muaxu')->with(['pay' => 1, 'user' => $user]);
            } else {
                return redirect('/muaxu')->with(['pay' => 2, 'user' => $user]);
            }
        } else {
            return redirect('/muaxu')->with(['pay' => 3, 'user' => $user]);
        }
    }
}
