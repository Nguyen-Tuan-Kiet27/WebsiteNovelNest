<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class LichSuRutMoi implements ShouldBroadcastNow
{
    public $lichSuRut;

    public function __construct($lichSuRut)
    {
        $this->lichSuRut = $lichSuRut;
    }

    public function broadcastOn()
    {
        return new Channel('admin-lich-su-rut');
    }

    public function broadcastAs()
    {
        return 'LichSuRutMoi';
    }
}
