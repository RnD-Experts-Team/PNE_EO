<?php

namespace App\Console\Commands;
use App\Services\EventConsume\JetStreamConsumer;

use Illuminate\Console\Command;

class NatsConsume extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:nats-consume';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description events into PNE_EO database';

    /**
     * Execute the console command.
     */
    public function handle(JetStreamConsumer $consumer): int
    {
        $this->info('Starting JetStream consumer...');
        $consumer->runForever();
        return self::SUCCESS;
    }
}
