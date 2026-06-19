<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;

// Handle preflight OPTIONS requests (needed for CORS)
Route::options('{any}', [ItemController::class, 'options'])->where('any', '.*');

// Important: search and suggest must come BEFORE the {id} wildcard
Route::get('/items/search',  [ItemController::class, 'search']);
Route::get('/items/suggest', [ItemController::class, 'suggest']);

Route::get('/items',         [ItemController::class, 'index']);
Route::post('/items',        [ItemController::class, 'store']);
Route::delete('/items/{id}', [ItemController::class, 'destroy']);