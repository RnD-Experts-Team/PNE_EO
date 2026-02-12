<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    public $incrementing = false;
    protected $keyType = 'int';
    use  HasApiTokens,HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'id',
        'name',
        'email',
    ];

    protected $hidden = [
        'remember_token',
    ];
 
}
