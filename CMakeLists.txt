cmake_minimum_required(VERSION 3.10)
project(zyra)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Adiciona os arquivos fonte
add_executable(zyra
    src/main.cpp
    src/lexer.cpp
) 