<?php
namespace App\Services;

use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Token\Plain;
use Lcobucci\JWT\Validation\Constraint\SignedWith;

class JwtService
{
    protected Configuration $config;

    public function __construct()
    {
        $this->config = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText(env('JWT_SECRET', 'super-secret-key')) // dùng env
        );
    }

    public function generateToken(string $userId): string
    {
        $now = new \DateTimeImmutable();

        return $this->config->builder()
            ->issuedBy('novelnest') // tuỳ chọn
            ->issuedAt($now)
            ->expiresAt($now->modify('+7 days'))
            ->withClaim('uid', $userId)
            ->getToken($this->config->signer(), $this->config->signingKey())
            ->toString();
    }

    public function parseToken(string $token): ?Plain
    {
        try {
            $token = $this->config->parser()->parse($token);

            if (!($token instanceof Plain)) {
                return null;
            }

            $constraints = $this->config->validationConstraints();
            $constraints[] = new SignedWith($this->config->signer(), $this->config->signingKey());

            if (!$this->config->validator()->validate($token, ...$constraints)) {
                return null;
            }

            return $token;
        } catch (\Throwable $e) {
            return null;
        }
    }
}