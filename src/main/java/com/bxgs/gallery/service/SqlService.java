package com.bxgs.gallery.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
@RequiredArgsConstructor
public class SqlService {
    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;

    @Transactional
    public void executeSql(String sqlType) {
        Resource resource = resourceLoader.getResource("classpath:templates/sql/" + sqlType + ".sql");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            StringBuilder sql = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                line = removeComments(line);
                sql.append(line).append("\n");
            }

            // SQL 문장을 세미콜론으로 나누기
            String[] sqlStatements = sql.toString().split(";");
            for (String statement : sqlStatements) {
                String trimmedStatement = statement.trim();
                if (!trimmedStatement.isEmpty()) {
                    try {
                        jdbcTemplate.execute(trimmedStatement); // 세미콜론 없이 실행
                    } catch (DataAccessException e) {
                        System.out.println("Database access error for statement: " + trimmedStatement);
                        System.out.println("Error message: " + e.getMessage());
                        throw e; // 예외를 다시 던져서 트랜잭션 롤백을 유도
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("File reading error: " + e.getMessage());
        }
    }

    // 주석부분 처리
    private String removeComments(String line) {
        // 한 줄 주석 제거
        int singleLineCommentIndex = line.indexOf("--");
        if (singleLineCommentIndex != -1) {
            line = line.substring(0, singleLineCommentIndex);
        }

        // 여러 줄 주석 제거
        StringBuilder result = new StringBuilder();
        boolean inBlockComment = false;
        for (int i = 0; i < line.length(); i++) {
            if (i < line.length() - 1 && line.substring(i, i + 2).equals("/*")) {
                inBlockComment = true;
                i++; // Skip the next character
            } else if (i < line.length() - 1 && line.substring(i, i + 2).equals("*/")) {
                inBlockComment = false;
                i++; // Skip the next character
            } else if (!inBlockComment) {
                result.append(line.charAt(i));
            }
        }
        return result.toString();
    }

}
