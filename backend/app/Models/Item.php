<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'name',
        'description',
        'location_note',
        'image_path'
    ];
}