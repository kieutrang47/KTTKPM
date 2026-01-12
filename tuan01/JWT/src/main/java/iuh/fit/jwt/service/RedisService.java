package iuh.fit.jwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // Lưu Token vào Blacklist với thời gian sống (TTL) đúng bằng thời gian còn lại của Token
    public void saveToBlacklist(String token, long timeToLiveInMillis) {
        String key = "BLACKLIST_" + token;
        redisTemplate.opsForValue().set(key, "logout", timeToLiveInMillis, TimeUnit.MILLISECONDS);
    }

    // Kiểm tra xem Token có nằm trong Blacklist không
    public boolean isBlacklisted(String token) {
        String key = "BLACKLIST_" + token;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}